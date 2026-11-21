import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDF4F1] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-[#F3E8E2] shadow-card-soft text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-bold text-[#12183A] mb-2">Something went wrong</h2>
            <p className="text-xs text-[#595F72] mb-4">
              {this.state.error?.message || 'An unexpected error occurred in the queue application.'}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('glamoursync_app_state_v1');
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-[#12183A] text-white rounded-xl text-xs font-semibold hover:bg-[#1E2548]"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
