"""Persistent local preview server for the DilijansFF static site."""

from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


SITE_ROOT = Path(__file__).resolve().parent.parent
URL_PREFIX = "/dilijansff"


class PreviewRequestHandler(SimpleHTTPRequestHandler):
    """Serve the repository root under the production-like URL prefix."""

    def translate_path(self, path: str) -> str:
        request_path = urlsplit(path).path

        if request_path == URL_PREFIX:
            request_path = "/"
        elif request_path.startswith(f"{URL_PREFIX}/"):
            request_path = request_path[len(URL_PREFIX) :]

        return super().translate_path(request_path)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format: str, *args: object) -> None:
        # The server normally runs through pythonw without a console window.
        return


class PreviewServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8766, type=int)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    handler = partial(PreviewRequestHandler, directory=str(SITE_ROOT))

    with PreviewServer((args.host, args.port), handler) as server:
        server.serve_forever()


if __name__ == "__main__":
    main()
