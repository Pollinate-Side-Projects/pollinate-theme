import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "cuteMascotView",
      new CuteMascotViewProvider(context.extensionUri)
    )
  );
}

class CuteMascotViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: false,
      localResourceRoots: [this.extensionUri],
    };

    const mascotUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "mascot.png")
    );

    // Minimal, safe CSP for a static image-only view.
    const csp = `default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline';`;

    webview.html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: transparent; }
      .wrap {
        display: grid;
        place-items: center;
        padding: 6px 0 8px;
      }
      img {
        width: 28px;
        height: 28px;
        opacity: 0.75;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <img src="${mascotUri}" alt="Mascot" />
    </div>
  </body>
</html>`;
  }
}
