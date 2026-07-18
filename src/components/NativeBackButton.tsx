import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

// Root routes where the hardware back button should exit the app
// (or minimize) instead of navigating further back.
const ROOT_ROUTES = new Set(["/esim_home", "/", "/eSIM"]);

export const NativeBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: { remove: () => void } | undefined;

    const setup = async () => {
      handle = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        // If a modal/dialog is open, let the browser default close it
        const openDialog = document.querySelector(
          '[role="dialog"][data-state="open"], [data-state="open"][role="alertdialog"]'
        );
        if (openDialog) {
          const closeBtn = openDialog.querySelector<HTMLElement>(
            '[data-dismiss], [aria-label="Close"], button.close'
          );
          if (closeBtn) {
            closeBtn.click();
            return;
          }
        }

        const path = window.location.pathname;
        if (ROOT_ROUTES.has(path) || !canGoBack) {
          // At root: minimize the app instead of hard-closing
          CapacitorApp.minimizeApp().catch(() => CapacitorApp.exitApp());
          return;
        }
        navigate(-1);
      });
    };

    setup();
    return () => {
      handle?.remove();
    };
  }, [navigate, location.pathname]);

  return null;
};
