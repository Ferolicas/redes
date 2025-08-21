export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center container">
      <div className="text-center space-y-8 animate-fade-in-up">
        <h1 className="gradient-text">Store Planeta Keto</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Descubre productos keto de alta calidad para tu estilo de vida saludable
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <a href="/links" className="btn btn-primary">
            Ver Productos
          </a>
          <a href="/admin" className="btn btn-secondary">
            Administración
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl mb-4">🥑</div>
            <h3 className="text-xl font-semibold mb-2">Productos Keto</h3>
            <p className="text-sm">Alimentos cetogénicos premium para tu dieta</p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
            <p className="text-sm">Recibe tus productos de forma rápida y segura</p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
            <p className="text-sm">Solo trabajamos con las mejores marcas</p>
          </div>
        </div>
      </div>
    </div>
  )
}