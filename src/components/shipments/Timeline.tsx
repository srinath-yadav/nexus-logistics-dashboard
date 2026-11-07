import type { StepState, TimelineStep } from "../../lib/timeline";

// Full class strings for Tailwind
const DOT_STYLES: Record<StepState, string> = {
  done: "border-transit bg-transit",
  current: "border-transit bg-bg",
  warning: "border-delayed bg-delayed/30",
  problem: "border-exception bg-exception/30",
  upcoming: "border-line-strong bg-bg",
};

const STATE_LABELS: Record<StepState, string> = {
  done: "Completed",
  current: "In progress",
  warning: "Delayed",
  problem: "Problem",
  upcoming: "Not started",
};

const Timeline = ({ steps }: { steps: TimelineStep[] }) => (
  <ol className="flex flex-col gap-4">
    {steps.map((step) => (
      <li
        key={step.label}
        aria-current={
          step.state !== "done" && step.state !== "upcoming" ?
            "step"
          : undefined
        }
        className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 ${DOT_STYLES[step.state]}`}
        />
        <span
          className={`text-sm ${step.state === "upcoming" ? "text-muted" : "text-ink"}`}>
          {step.label}
          <span className="sr-only"> — {STATE_LABELS[step.state]}</span>
        </span>
      </li>
    ))}
  </ol>
);

export default Timeline;
