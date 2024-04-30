// React
import { useMemo } from "react";

// Third Party
import resolveConfig from "tailwindcss/resolveConfig";

// Project
import tailwindConfig from "../../tailwind.config";

export default function useTailwind() {
  const tailwind = useMemo(
    () => resolveConfig(tailwindConfig),
    [tailwindConfig]
  );

  return tailwind;
}
