export function getAssetUrl(relativePath: string): string {
  if (typeof window !== 'undefined') {
    const inlineAssets = (
      window as unknown as { __DESCIFRA_ASSETS__?: Record<string, string> }
    ).__DESCIFRA_ASSETS__;
    if (inlineAssets && inlineAssets[relativePath]) {
      return inlineAssets[relativePath];
    }
  }
  return `${import.meta.env.BASE_URL}${relativePath}`;
}
