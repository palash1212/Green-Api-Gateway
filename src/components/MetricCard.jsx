// MetricCard.jsx
import React from "react";

const MetricCard = ({
  title,
  mainValue,
  subValue = "",
  description,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {mainValue || "0"}
            </span>
            {subValue && (
              <span className="ml-1 text-sm text-gray-500">{subValue}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
};

// Make sure this is the default export
export default MetricCard;
