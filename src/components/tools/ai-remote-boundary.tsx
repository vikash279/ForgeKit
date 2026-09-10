"use client";

import { Component, type ReactNode } from "react";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  message: string | null;
}

export class AiRemoteBoundary extends Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message };
  }

  render() {
    if (this.state.message) {
      return (
        <ToolErrorBanner
          error={{
            message: `${this.props.fallbackLabel ?? "Remote AI failed"}: ${this.state.message}. Local fallback is available.`,
          }}
        />
      );
    }
    return this.props.children;
  }
}
