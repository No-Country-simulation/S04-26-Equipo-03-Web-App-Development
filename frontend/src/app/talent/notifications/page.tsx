'use client';

import { notifications } from './_data';
import NotificationsHeader from './NotificationsHeader';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <NotificationsHeader />

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a2e] sm:text-3xl">
            Notificaciones
          </h1>
          <a
            href="#"
            className="text-sm text-[#374151] hover:text-[#374151]/80"
          >
            Marcar todas como leídas
          </a>
        </div>

        {/* Notifications List */}
        <div className="overflow-hidden rounded-lg border shadow-sm">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-center gap-3 border-b border-[#e5e7eb] px-4 py-3 last:border-b-0 sm:gap-4 sm:px-6 sm:py-4 ${
                  !notification.read ? 'bg-[#ede9fe]' : 'bg-white'
                }`}
              >
                {/* Dot indicator */}
                {!notification.read && (
                  <div className="mt-0.5 h-2 w-2 shrink-0 self-start rounded-full bg-[#4f46e5] sm:mt-1"></div>
                )}

                {/* Icon */}
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md border p-2 text-[#6b7280] sm:mt-0.5 sm:size-10 ${
                    !notification.read ? 'bg-white' : ''
                  }`}
                >
                  <Icon className="size-4 sm:size-5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#1a1a2e] sm:text-base">
                    {notification.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-[#6b7280] sm:text-sm">
                    {notification.description}
                  </p>
                </div>

                {/* Time */}
                <div className="shrink-0 text-right text-xs text-[#9ca3af] sm:text-sm">
                  {notification.time}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
