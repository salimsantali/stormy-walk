declare module 'claude-code' {
  interface PluginState {
    'research-space': { latestRow: string | null; rowCount: number; catsHidden: boolean }
  }
}

export {}
