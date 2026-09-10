const FIELD_NAMES = ["minute", "hour", "day of month", "month", "day of week"] as const;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface CronEvaluation {
  expression: string;
  explanation: string;
  next: string[];
}

function parseField(field: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const part of field.split(",")) {
    if (part === "*") {
      for (let i = min; i <= max; i += 1) values.add(i);
      continue;
    }
    const stepMatch = part.match(/^(?:\*|(\d+)-(\d+))\/(\d+)$/);
    if (stepMatch) {
      const start = stepMatch[1] ? Number(stepMatch[1]) : min;
      const end = stepMatch[2] ? Number(stepMatch[2]) : max;
      const step = Number(stepMatch[3]);
      for (let i = start; i <= end; i += step) values.add(i);
      continue;
    }
    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) {
      for (let i = Number(range[1]); i <= Number(range[2]); i += 1) values.add(i);
      continue;
    }
    if (/^\d+$/.test(part)) {
      values.add(Number(part));
      continue;
    }
    throw new Error(`Invalid cron field: ${field}`);
  }
  return [...values].filter((value) => value >= min && value <= max).sort((a, b) => a - b);
}

function describe(field: string, name: string, labels?: string[]): string {
  if (field === "*") return `every ${name}`;
  if (field.startsWith("*/")) return `every ${field.slice(2)} ${name}s`;
  if (labels && /^\d+$/.test(field)) {
    const label = labels[Number(field)] ?? field;
    return `${name} ${label}`;
  }
  return `${name} ${field}`;
}

export function evaluateCron(expression: string, from = new Date(), count = 5): CronEvaluation {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error("Use a 5-field cron expression: m h dom mon dow");
  const [minute, hour, dom, month, dow] = parts as [string, string, string, string, string];
  const minutes = parseField(minute, 0, 59);
  const hours = parseField(hour, 0, 23);
  const days = parseField(dom, 1, 31);
  const months = parseField(month, 1, 12);
  const weekdays = parseField(dow, 0, 7).map((value) => (value === 7 ? 0 : value));

  const explanation = [
    describe(minute, FIELD_NAMES[0]),
    describe(hour, FIELD_NAMES[1]),
    describe(dom, FIELD_NAMES[2]),
    describe(month, FIELD_NAMES[3], [undefined, ...MONTHS] as string[]),
    describe(dow, FIELD_NAMES[4], WEEKDAYS),
  ].join(", ");

  const next: string[] = [];
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  let guard = 0;
  while (next.length < count && guard < 366 * 24 * 60) {
    guard += 1;
    const m = cursor.getMinutes();
    const h = cursor.getHours();
    const d = cursor.getDate();
    const mo = cursor.getMonth() + 1;
    const w = cursor.getDay();
    const bothRestricted = parts[2] !== "*" && parts[4] !== "*";
    const okDay = bothRestricted
      ? days.includes(d) || weekdays.includes(w)
      : parts[2] !== "*"
        ? days.includes(d)
        : parts[4] !== "*"
          ? weekdays.includes(w)
          : true;
    if (minutes.includes(m) && hours.includes(h) && months.includes(mo) && okDay) {
      next.push(cursor.toISOString());
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return { expression: parts.join(" "), explanation, next };
}
