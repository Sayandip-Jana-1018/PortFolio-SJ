/**
 * Decides when a full screen shader should render at a lower resolution.
 *
 * Frame times alone cannot say the shader is at fault, because a busy main thread
 * or a browser in battery saver looks identical. So every drop is an experiment:
 * step down, then keep the lower resolution only if frames actually got faster.
 * If they did not, the shader was not the problem and full quality comes back.
 * A device that keeps up never leaves step 0.
 */

/** Average frame time over one window. */
const WINDOW_MS = 1500;
/** Above this (under about 45 fps) the device counts as struggling. */
const SLOW_FRAME_MS = 22;
/** Below this (about 54 fps or better) there is room to try more resolution. */
const FAST_FRAME_MS = 18.5;
/** A step down must make frames at least this much faster to be kept. */
const REQUIRED_IMPROVEMENT = 0.9;
/** Single frames longer than this are tab switches or page load, not GPU load. */
const MAX_SAMPLE_MS = 250;
/** Page load work would otherwise look like GPU load. */
const STARTUP_GRACE_MS = 3000;
/** After a step down that did not help, leave resolution alone for this long. Doubles each time. */
const INITIAL_DROP_BACKOFF_MS = 30000;
const MAX_DROP_BACKOFF_MS = 300000;
const INITIAL_UPGRADE_WAIT_MS = 8000;
const MAX_UPGRADE_WAIT_MS = 120000;

export interface ResolutionGovernorOptions {
  /** Index of the lowest quality step. Step 0 is full quality. */
  lastStep: number;
  initialStep?: number;
  /** Called whenever the step changes. */
  onStepChange: (step: number) => void;
}

export function createResolutionGovernor({ lastStep, initialStep = 0, onStepChange }: ResolutionGovernorOptions) {
  let step = initialStep;
  let startedAt = -1;
  let windowStart = 0;
  let sum = 0;
  let frames = 0;
  let dropped: { fromStep: number; averageBefore: number } | null = null;
  let upgraded = false;
  let noDropBefore = 0;
  let noUpgradeBefore = 0;
  let upgradeWait = INITIAL_UPGRADE_WAIT_MS;
  let dropBackoff = INITIAL_DROP_BACKOFF_MS;

  const setStep = (next: number) => {
    step = next;
    onStepChange(next);
  };

  const evaluate = (average: number, now: number) => {
    // Judge the last step down before anything else.
    if (dropped) {
      const { fromStep, averageBefore } = dropped;
      dropped = null;
      if (average > averageBefore * REQUIRED_IMPROVEMENT) {
        noDropBefore = now + dropBackoff;
        dropBackoff = Math.min(dropBackoff * 2, MAX_DROP_BACKOFF_MS);
        setStep(fromStep);
      } else {
        noUpgradeBefore = now + upgradeWait;
      }
      return;
    }

    if (average > SLOW_FRAME_MS) {
      // A step up that immediately struggles waits longer before trying again.
      if (upgraded) {
        upgraded = false;
        upgradeWait = Math.min(upgradeWait * 2, MAX_UPGRADE_WAIT_MS);
        noUpgradeBefore = now + upgradeWait;
        if (step < lastStep) setStep(step + 1);
        return;
      }
      if (step < lastStep && now >= noDropBefore) {
        dropped = { fromStep: step, averageBefore: average };
        setStep(step + 1);
      }
      return;
    }

    upgraded = false;
    if (average < FAST_FRAME_MS && step > 0 && now >= noUpgradeBefore) {
      upgraded = true;
      noUpgradeBefore = now + upgradeWait;
      setStep(step - 1);
    }
  };

  return {
    /** Throw away the current window, for moments that say nothing about the GPU. */
    discardWindow(now: number) {
      sum = 0;
      frames = 0;
      windowStart = now;
    },
    /** Feed the time between two animation frames. */
    sample(deltaMs: number, now: number) {
      if (startedAt < 0) {
        startedAt = now;
        windowStart = now;
      }
      if (now - startedAt < STARTUP_GRACE_MS) {
        windowStart = now;
        return;
      }
      if (deltaMs > MAX_SAMPLE_MS) {
        // Discard the window: this gap says nothing about GPU load.
        sum = 0;
        frames = 0;
        windowStart = now;
        return;
      }
      sum += deltaMs;
      frames++;
      if (now - windowStart >= WINDOW_MS) {
        const average = sum / frames;
        sum = 0;
        frames = 0;
        windowStart = now;
        evaluate(average, now);
      }
    },
    get step() {
      return step;
    },
  };
}
