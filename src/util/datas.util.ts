export function converterParaDate(dataString: string) {
  let dataComSplit = dataString.split('/', 3)
  let dataConvertida = new Date(Number(dataComSplit[2]), Number(dataComSplit[1]) - 1, Number(dataComSplit[0]));
  return dataConvertida;
}

export function setTimeFromString(base: Date, timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  const updated = new Date(base);
  updated.setHours(hours, minutes, seconds || 0, 0);

  return updated;
}
