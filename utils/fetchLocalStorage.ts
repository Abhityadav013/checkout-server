const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function waitForIds(maxTries = 3, intervalMs = 1000) {
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    const tid = localStorage.getItem("tid");
    const ssid = localStorage.getItem("ssid");
    if (tid && ssid) return { tid, ssid };
    if (attempt < maxTries) await sleep(intervalMs);
  }
  return { tid: null as string | null, ssid: null as string | null };
}