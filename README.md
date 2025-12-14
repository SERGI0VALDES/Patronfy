patronfy/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── src/
    ├── components/          # Componentes reutilizables
    │   ├── common/         # Componentes globales
    │   ├── ui/             # Componentes de UI puros
    │   └── index.ts        # Barrel exports
    ├── screens/            # Pantallas organizadas por módulo
    │   ├── auth/           # Módulo de autenticación
    │   ├── music/          # Módulo de música
    │   ├── profile/        # Módulo de perfil
    │   └── index.ts        # Barrel exports
    ├── navigation/         # Configuración de navegación
    ├── services/           # Lógica de negocio y APIs
    ├── store/              # Estado global (Redux/Zustand)
    ├── utils/              # Funciones helper
    ├── constants/          # Constantes de la app
    ├── types/              # Definiciones TypeScript
    ├── assets/             # Recursos estáticos
    └── themes/             # Estilos y temas

    ESTRUCTURA DETALLADA POR MÓDULOS

    screens/
├── auth/                   # Módulo de autenticación
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   └── index.ts
├── music/                  # Módulo de música
│   ├── HomeScreen.tsx
│   ├── DiscoverScreen.tsx
│   ├── PlaylistScreen.tsx
│   ├── ArtistScreen.tsx
│   └── index.ts
├── profile/                # Módulo de perfil
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── SubscriptionScreen.tsx
│   └── index.ts
└── index.ts                # Exporta todas las pantallas

Components/ (Componentes organizados)

components/
├── common/                 # Componentes globales
│   ├── Header.tsx
│   ├── BottomTabBar.tsx
│   ├── LoadingSpinner.tsx
│   └── index.ts
├── ui/                     # Componentes de UI puros
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   └── index.ts
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── Card.styles.ts
│   │   └── index.ts
│   └── index.ts
├── music/                  # Componentes específicos de música
│   ├── SongCard.tsx
│   ├── PlaylistGrid.tsx
│   ├── PlayerControls.tsx
│   └── index.ts
└── index.ts