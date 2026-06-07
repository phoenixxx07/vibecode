export async function register() {
  if (!process.env.TZ) {
    process.env.TZ = "Asia/Jakarta";
  }
}
