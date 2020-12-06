export async function nextTick(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve))
}
