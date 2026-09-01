import { cn } from "../lib/cn";

export interface ComparisonFeature {
  name: string;
  values: (string | boolean)[];
}

export interface ComparisonTableProps {
  plans: string[];
  features: ComparisonFeature[];
  className?: string;
}

/**
 * Side-by-side feature comparison table. Each plan column is a `<th>` with
 * `scope="col"`. The table uses `aria-label` for the comparison title.
 */
export function ComparisonTable({ plans, features, className }: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto text-start", className)}>
      <table className="w-full border-collapse text-sm" role="table" aria-label="Feature comparison">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            <th scope="col" className="p-3 text-start font-medium text-neutral-600 dark:text-neutral-400">
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan}
                scope="col"
                className="p-3 text-center font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.name} className="border-b border-neutral-100 dark:border-neutral-900">
              <th scope="row" className="p-3 text-start font-medium text-neutral-700 dark:text-neutral-300">
                {feature.name}
              </th>
              {feature.values.map((value, index) => (
                <td key={index} className="p-3 text-center">
                  {typeof value === "boolean" ? (
                    <span role="img" aria-label={value ? "Included" : "Not included"}>
                      <span aria-hidden="true" className={value ? "text-green-600 dark:text-green-400" : "text-neutral-300 dark:text-neutral-600"}>
                        {value ? "✓" : "—"}
                      </span>
                    </span>
                  ) : (
                    <span className="text-neutral-700 dark:text-neutral-300">{value}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
