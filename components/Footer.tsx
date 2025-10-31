'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Github, Heart } from 'lucide-react';

const translations = {
  en: {
    madeWith: "Made with",
    by: "by",
    copyright: "© 2025 La Petite Sourdough. All rights reserved.",
    illustrations: "Illustrations by Ariella's Secret Garden",
    contact: "Contact",
    sourceCode: "Source Code"
  },
  ru: {
    madeWith: "Сделано с",
    by: "",
    copyright: "© 2025 La Petite Sourdough. Все права защищены.",
    illustrations: "Иллюстрации: Ariella's Secret Garden",
    contact: "Контакт",
    sourceCode: "Исходный Код"
  }
};

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <footer className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{t.madeWith}</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            {t.by && <span>{t.by}</span>}
            <span className="font-semibold">Pavel Klug</span>
          </div>

          {/* Contact links */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:pavelklug@gmail.com"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors"
              aria-label={t.contact}
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">{t.contact}</span>
            </a>
            <a
              href="https://github.com/PavelK-at-964784600414/dope-dough"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors"
              aria-label={t.sourceCode}
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">{t.sourceCode}</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 text-center">
            <div>{t.copyright}</div>
            <div className="mt-1">{t.illustrations}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
