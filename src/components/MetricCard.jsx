import React from "react";

export default function MetricCard({
  title,
  mainValue,
  subValue,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-start hover:shadow-md transition">
      <div>
        <p className="text-gray-600 font-medium">{title}</p>

        <h3 className="text-3xl font-bold mt-2 text-gray-900">
          {mainValue}
          {subValue && (
            <span className="text-gray-400 font-semibold ml-1">{subValue}</span>
          )}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>

      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon className={`text-2xl ${iconColor}`} />
      </div>
    </div>
  );
}
