interface Parameters {
  [key: string]: any
}

export class UrlUtilities {
  public static buildUrl(baseUrl: string, controller: string, actions?: string[], params: Parameters = {}): string {
    const parameters = new URLSearchParams();
    for (const name in params ?? {}) {
      var param = params[name];
      if (param instanceof Date) {
        param = param.toISOString();
      }
      parameters.set(name, param);
    }
    return [
      `${baseUrl}/${[controller].concat(actions || []).join('/')}`,
      parameters.toString()
    ].filter(x => x?.length > 0).join('?');
  }
}
