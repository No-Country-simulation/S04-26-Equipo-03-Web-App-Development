'use client';

import { notifications } from './_data';
import NotificationsHeader from './NotificationsHeader';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <NotificationsHeader />

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Notificaciones</h1>
          <a
            href="#"
            className="text-sm text-[#374151] hover:text-[#374151]/80"
          >
            Marcar todas como leídas
          </a>
        </div>

        {/* Notifications List */}
        <div className="space-y-px border rounded-lg overflow-hidden">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex gap-4 border-b border-[#e5e7eb] px-6 py-4 last:border-b-0 items-center ${
                  !notification.read ? 'bg-[#ede9fe]' : 'bg-white'
                }`}
              >
                {/* Dot indicator */}
                {!notification.read && (
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#4f46e5]"></div>
                )}
                {notification.read && (
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-transparent"></div>
                )}

                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-10 w-10 p-2 shrink-0 items-center justify-center border rounded-md text-[#6b7280] ${!notification.read ? 'bg-white' : ''}`}
                >
                  <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a1a2e]">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-[#6b7280]">
                    {notification.description}
                  </p>
                </div>

                {/* Time */}
                <div className="shrink-0 text-right text-sm text-[#9ca3af]">
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
