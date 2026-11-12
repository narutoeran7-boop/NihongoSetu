// ==============================================================================
// NIHONGOSETU — ADVANCED VOICE ACTIVITY DETECTOR & NOISE SUPPRESSION ENGINE
// Studio-grade audio constraints, bandpass vocal filtering, and adaptive turn detection
// ==============================================================================

export interface VADConfig {
  minSpeechDurationMs: number; // Minimum speech duration to distinguish voice from clicks (default: 220ms)
  silenceTurnTimeoutMs: number; // Silence duration before auto-committing turn (default: 1100ms)
  noiseSensitivityMargin: number; // dB/volume margin above ambient noise floor (default: 14)
  baseSpeechThreshold: number; // Absolute minimum volume for speech (default: 22)
  interruptionThreshold: number; // Stricter threshold needed to interrupt AI speaking (default: 45)
  maxSpeechTurnMs: number; // Safety timeout for single speech turn (default: 18000ms)
}

export const DEFAULT_VAD_CONFIG: VADConfig = {
  minSpeechDurationMs: 220,
  silenceTurnTimeoutMs: 1100,
  noiseSensitivityMargin: 14,
  baseSpeechThreshold: 22,
  interruptionThreshold: 45,
  maxSpeechTurnMs: 18000,
};

export type VADState =
  | "idle"
  | "listening"
  | "speech_detected"
  | "processing"
  | "speaking"
  | "no_speech_detected"
  | "interrupted"
  | "error";

export interface AudioStats {
  volume: number; // 0..100
  ambientNoiseFloor: number;
  speechThreshold: number;
  isVoiceActive: boolean;
  frequencyData: Uint8Array;
}

export class VoiceActivityDetector {
  private config: VADConfig;
  private audioContext: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private highPassFilter: BiquadFilterNode | null = null;
  private lowPassFilter: BiquadFilterNode | null = null;
  private animationFrameId: number | null = null;

  // Adaptive Noise Floor Tracking
  private ambientNoiseFloor: number = 12;
  private noiseSamplesCount: number = 0;

  // Speech duration tracking
  private speechStartTime: number = 0;
  private isVoiceActive: boolean = false;
  private lastVoiceActiveTime: number = 0;
  private turnSilenceTimer: NodeJS.Timeout | null = null;
  private safetyTurnTimeout: NodeJS.Timeout | null = null;

  // Callbacks
  public onStateChange?: (state: VADState) => void;
  public onVolumeUpdate?: (stats: AudioStats) => void;
  public onTurnComplete?: (reason: "final_event" | "silence_timeout" | "max_turn_timeout") => void;
  public onInterruptionTriggered?: () => void;

  // Current operational mode
  private currentState: VADState = "idle";
  private isAISpeaking: boolean = false;
  private isMuted: boolean = false;

  constructor(customConfig?: Partial<VADConfig>) {
    this.config = { ...DEFAULT_VAD_CONFIG, ...customConfig };
  }

  public getState(): VADState {
    return this.currentState;
  }

  public setState(newState: VADState) {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.onStateChange?.(newState);
  }

  public setAIPlaybackState(isSpeaking: boolean) {
    this.isAISpeaking = isSpeaking;
    if (isSpeaking) {
      this.setState("speaking");
      this.clearSilenceTimer();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.clearSilenceTimer();
    }
  }

  /**
   * Initializes microphone stream with studio-grade noise suppression and echo cancellation
   */
  public async initializeStream(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      this.setState("error");
      return false;
    }

    try {
      // 1. Studio-grade audio constraints
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true },
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 48000 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.micStream = stream;

      // 2. Web Audio Graph initialization
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      this.audioContext = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);

      // 3. Bandpass Vocal Filter (High-pass 85Hz to cut fan/AC rumble, Low-pass 3500Hz to cut hiss/clatter)
      const highPass = audioCtx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.value = 85;
      this.highPassFilter = highPass;

      const lowPass = audioCtx.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.value = 3500;
      this.lowPassFilter = lowPass;

      // 4. Analyser Node
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      this.analyser = analyser;

      // Connect: mic -> highPass -> lowPass -> analyser
      source.connect(highPass);
      highPass.connect(lowPass);
      lowPass.connect(analyser);

      this.startProcessingLoop();
      this.setState("listening");
      return true;
    } catch {
      this.setState("error");
      return false;
    }
  }

  /**
   * Continuous Audio Energy Analysis Loop
   */
  private startProcessingLoop() {
    if (!this.analyser) return;

    const analyser = this.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const process = () => {
      this.animationFrameId = requestAnimationFrame(process);
      analyser.getByteFrequencyData(dataArray);

      // Calculate Root Mean Square energy
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const val = dataArray[i];
        sumSquares += val * val;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      // Normalized volume (0..100)
      const currentVolume = Math.min(100, Math.round((rms / 255) * 100 * 1.5));

      const now = Date.now();

      // Dynamic Speech Threshold calculation
      const dynamicSpeechThreshold = Math.max(
        this.config.baseSpeechThreshold,
        this.ambientNoiseFloor + this.config.noiseSensitivityMargin
      );

      // Check if current volume qualifies as voice candidate
      const isCandidateSound = currentVolume >= dynamicSpeechThreshold && !this.isMuted;

      if (isCandidateSound) {
        if (!this.speechStartTime) {
          this.speechStartTime = now;
        }

        const duration = now - this.speechStartTime;

        // Only promote to genuine speech once minimum speech duration is sustained
        if (duration >= this.config.minSpeechDurationMs) {
          if (!this.isVoiceActive) {
            this.isVoiceActive = true;
            this.clearSilenceTimer();

            // If AI is currently speaking, require a stricter sustained threshold to interrupt
            if (this.isAISpeaking) {
              if (currentVolume >= this.config.interruptionThreshold && duration >= 320) {
                this.onInterruptionTriggered?.();
              }
            } else if (this.currentState === "listening") {
              this.setState("speech_detected");
              // Start safety timeout to avoid indefinite speech recording
              this.startSafetyTurnTimeout();
            }
          }
          this.lastVoiceActiveTime = now;
        }
      } else {
        // Sound is below speech threshold (silence or ambient noise)
        this.speechStartTime = 0;

        // Adaptively calibrate ambient noise floor during quiet moments
        if (currentVolume < dynamicSpeechThreshold - 4 && !this.isAISpeaking) {
          this.noiseSamplesCount++;
          // Slowly track ambient noise floor using exponential moving average
          this.ambientNoiseFloor = this.ambientNoiseFloor * 0.98 + currentVolume * 0.02;
        }

        // If voice was active previously, detect when silence persists
        if (this.isVoiceActive && !this.isAISpeaking) {
          const silenceDuration = now - this.lastVoiceActiveTime;
          if (silenceDuration > 300 && !this.turnSilenceTimer) {
            // Initiate end-of-turn silence debounce
            this.startSilenceTurnTimer();
          }
        }
      }

      this.onVolumeUpdate?.({
        volume: currentVolume,
        ambientNoiseFloor: Math.round(this.ambientNoiseFloor),
        speechThreshold: Math.round(dynamicSpeechThreshold),
        isVoiceActive: this.isVoiceActive,
        frequencyData: dataArray,
      });
    };

    process();
  }

  private startSilenceTurnTimer() {
    this.clearSilenceTimer();
    this.turnSilenceTimer = setTimeout(() => {
      if (this.isVoiceActive && !this.isAISpeaking) {
        this.isVoiceActive = false;
        this.clearSilenceTimer();
        this.clearSafetyTimeout();
        this.setState("processing");
        this.onTurnComplete?.("silence_timeout");
      }
    }, this.config.silenceTurnTimeoutMs);
  }

  private startSafetyTurnTimeout() {
    this.clearSafetyTimeout();
    this.safetyTurnTimeout = setTimeout(() => {
      if (this.isVoiceActive && !this.isAISpeaking) {
        this.isVoiceActive = false;
        this.clearSilenceTimer();
        this.clearSafetyTimeout();
        this.setState("processing");
        this.onTurnComplete?.("max_turn_timeout");
      }
    }, this.config.maxSpeechTurnMs);
  }

  public clearSilenceTimer() {
    if (this.turnSilenceTimer) {
      clearTimeout(this.turnSilenceTimer);
      this.turnSilenceTimer = null;
    }
  }

  private clearSafetyTimeout() {
    if (this.safetyTurnTimeout) {
      clearTimeout(this.safetyTurnTimeout);
      this.safetyTurnTimeout = null;
    }
  }

  /**
   * Called by Web Speech API when recognition reports a final result
   */
  public handleSpeechRecognitionFinal() {
    this.clearSilenceTimer();
    this.clearSafetyTimeout();
    this.isVoiceActive = false;
    this.setState("processing");
    this.onTurnComplete?.("final_event");
  }

  /**
   * Resets internal voice activity state and returns to listening
   */
  public resetToListening() {
    this.clearSilenceTimer();
    this.clearSafetyTimeout();
    this.isVoiceActive = false;
    this.speechStartTime = 0;
    this.isAISpeaking = false;
    this.setState("listening");
  }

  /**
   * Disposes audio context, tracks, and animation loops
   */
  public destroy() {
    this.clearSilenceTimer();
    this.clearSafetyTimeout();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.analyser = null;
    this.highPassFilter = null;
    this.lowPassFilter = null;
    this.setState("idle");
  }
}

/**
 * Filter out noise-only or meaningless transcripts
 */
export function isMeaningfulSpeech(rawText: string): boolean {
  if (!rawText) return false;
  const clean = rawText.trim();
  if (clean.length < 2) return false;

  // Single punctuation or non-alphanumeric noise tokens
  if (/^[.\-_~,?!:;]+$/.test(clean)) return false;

  // Common noise hallucinations produced by engines on silence/static
  const NOISE_WORDS = [
    "uh", "um", "ah", "eh", "er", "mm", "hmm", "shh", "...",
    "you", "thank you", "bye", "subtitles by", "amara.org",
  ];
  if (NOISE_WORDS.includes(clean.toLowerCase())) return false;

  return true;
}

