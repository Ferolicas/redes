@echo off
chcp 65001 >nul
echo =========================================
echo CREADOR DE PROYECTOS NEXTJS + SANITY
echo =========================================

REM Obtener nombre del proyecto
set /p PROJECT_NAME="Nombre del proyecto (sin espacios): "

REM Crear carpeta del proyecto
mkdir %PROJECT_NAME%
cd %PROJECT_NAME%

echo.
echo ✅ Creando proyecto: %PROJECT_NAME%
echo.

REM Crear proyecto NextJS 15
echo 📦 Instalando NextJS 15...
call npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes

echo.
echo 📦 Instalando dependencias adicionales...

REM Instalar dependencias específicas
call npm install @sanity/client @sanity/image-url @stripe/stripe-js @tanstack/react-query date-fns lucide-react resend stripe

echo.
echo 📁 Creando estructura de carpetas...

REM Crear carpetas adicionales
mkdir app\admin
mkdir app\api\create-checkout
mkdir app\api\stripe-webhook
mkdir app\api\products
mkdir app\api\amazon-lists
mkdir app\api\dashboard-stats
mkdir app\api\transactions
mkdir app\api\download
mkdir app\exito
mkdir app\cancelado
mkdir app\links
mkdir components\admin
mkdir lib
mkdir types

echo.
echo 📝 Creando archivos de configuración...

REM Crear .env.local template
(
echo # Stripe
echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
echo STRIPE_SECRET_KEY=sk_test_...
echo STRIPE_WEBHOOK_SECRET=whsec_...
echo.
echo # Sanity
echo NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
echo NEXT_PUBLIC_SANITY_DATASET=production
echo SANITY_API_TOKEN=skl...
echo.
echo # Resend
echo RESEND_API_KEY=re_...
echo.
echo # URLs
echo NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
) > .env.local

REM Actualizar .gitignore
(
echo # Dependencies
echo node_modules/
echo.
echo # Production
echo .next/
echo out/
echo build/
echo.
echo # Environment variables
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo .env*.local
echo.
echo # Vercel
echo .vercel
echo.
echo # IDE
echo .vscode/
echo .idea/
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo *.log
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # Cache
echo .cache/
) > .gitignore

REM Actualizar next.config.js
(
echo /** @type {import('next'^}.NextConfig} */
echo const nextConfig = {
echo   images: {
echo     domains: ['cdn.sanity.io'],
echo   },
echo }
echo.
echo module.exports = nextConfig
) > next.config.js

REM Crear types/index.ts
(
echo export interface Product {
echo   _id: string
echo   title: string
echo   description: string
echo   price: number
echo   stripePriceId: string
echo   image: any
echo   includes: string[]
echo   type: 'digital' ^| 'service'
echo   fileUrl?: string
echo   createdAt: string
echo }
echo.
echo export interface AmazonList {
echo   _id: string
echo   title: string
echo   url: string
echo   image: any
echo   order: number
echo   createdAt: string
echo }
echo.
echo export interface Transaction {
echo   _id: string
echo   ketoCode: string
echo   stripeSessionId: string
echo   amount: number
echo   stripeCommission: number
echo   iva: number
echo   irpf: number
echo   netAmount: number
echo   customerEmail: string
echo   customerName: string
echo   productId: Product
echo   paymentMethod: string
echo   city: string
echo   status: 'success' ^| 'pending' ^| 'failed' ^| 'refunded'
echo   downloadCount: number
echo   maxDownloads: number
echo   createdAt: string
echo }
echo.
echo export interface DashboardStats {
echo   dailySales: { count: number; amount: number; net: number }
echo   monthlySales: { count: number; amount: number; net: number }
echo   totalSales: { count: number; amount: number; net: number }
echo   monthlyIVA: number
echo   monthlyIRPF: number
echo   totalIVA: number
echo   totalIRPF: number
echo   failedPayments: number
echo   pendingPayments: number
echo   refunds: number
echo }
) > types\index.ts

REM Crear archivos vacíos para código
echo // TODO: Agregar configuración Sanity> lib\sanity.ts
echo // TODO: Agregar configuración Stripe> lib\stripe.ts
echo // TODO: Agregar configuración Resend> lib\resend.ts
echo // TODO: Agregar configuración React Query> lib\queryClient.ts

echo // TODO: Página principal Links> app\links\page.tsx
echo // TODO: Panel de administración> app\admin\page.tsx
echo // TODO: Página de éxito> app\exito\page.tsx
echo // TODO: Página cancelado> app\cancelado\page.tsx

echo // TODO: API crear checkout> app\api\create-checkout\route.ts
echo // TODO: API webhook Stripe> app\api\stripe-webhook\route.ts
echo // TODO: API productos> app\api\products\route.ts
echo // TODO: API listas Amazon> app\api\amazon-lists\route.ts
echo // TODO: API estadísticas> app\api\dashboard-stats\route.ts
echo // TODO: API transacciones> app\api\transactions\route.ts

echo // TODO: Componente ProductCard> components\ProductCard.tsx
echo // TODO: Componente AmazonCard> components\AmazonCard.tsx
echo // TODO: Componente PurchaseModal> components\PurchaseModal.tsx

echo // TODO: Componente DashboardCard> components\admin\DashboardCard.tsx
echo // TODO: Componente CreateProductModal> components\admin\CreateProductModal.tsx
echo // TODO: Componente CreateListModal> components\admin\CreateListModal.tsx
echo // TODO: Componente TransactionsList> components\admin\TransactionsList.tsx

echo.
echo 🚀 Inicializando Git...
git init
git branch -M main
git add .
git commit -m "feat: proyecto inicial NextJS 15 + Sanity + Stripe"

echo.
echo =========================================
echo ✅ PROYECTO CREADO EXITOSAMENTE
echo =========================================
echo.
echo 📁 Proyecto: %PROJECT_NAME%
echo 🔧 NextJS 15 + TypeScript + Tailwind
echo 💳 Stripe + Sanity + React Query
echo 📧 Resend + Lucide Icons
echo.
echo PRÓXIMOS PASOS:
echo 1. Configurar variables en .env.local
echo 2. Crear repo en GitHub
echo 3. Conectar con Vercel
echo 4. Agregar código a los archivos
echo 5. npm run dev
echo.
echo ¡LISTO PARA DESARROLLAR!
echo.
pause