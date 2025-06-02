import React from "react";

interface Step {
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="step-indicator mb-4">
      <div className="step-progress">
        <div
          className="step-progress-bar"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>
      <div className="step-list">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          return (
            <div
              key={index}
              className={`step-item ${
                stepNumber === currentStep ? "active" : ""
              } ${stepNumber < currentStep ? "completed" : ""}`}
              onClick={() => onStepClick && onStepClick(stepNumber)}
              style={{ cursor: onStepClick ? "pointer" : "default" }}
            >
              <div className="step-item-circle">{stepNumber}</div>
              <div className="step-item-content">
                <div className="step-item-title">{step.title}</div>
                {step.description && (
                  <div className="step-item-description">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;