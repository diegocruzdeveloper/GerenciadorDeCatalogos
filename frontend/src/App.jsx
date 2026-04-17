import { useState, useEffect } from 'react';
import { Package, Search, Plus, Upload, Filter, Trash2, Edit } from 'lucide-react';
import { catalogApi } from '../api/catalog';

function App() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoItem, setNovoItem] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagemUrl: '',
  });
  const [imagemFile, setImagemFile] = useState(null);

  // Carregar itens ao iniciar
  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    setCarregando(true);
    setErro(null);
    try {
      let dados;
      if (filtroCategoria) {
        dados = await catalogApi.filtrarItens(filtroCategoria);
      } else {
        dados = await catalogApi.listarItens();
      }
      setItens(Array.isArray(dados) ? dados : []);
    } catch (err) {
      setErro('Erro ao carregar itens: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar itens:', err);
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    carregarItens();
  };

  const handleSalvarItem = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const itemParaSalvar = {
        ...novoItem,
        preco: parseFloat(novoItem.preco) || 0,
      };
      await catalogApi.salvarItem(itemParaSalvar);
      setNovoItem({
        nome: '',
        descricao: '',
        preco: '',
        categoria: '',
        imagemUrl: '',
      });
      setImagemFile(null);
      setMostrarFormulario(false);
      await carregarItens();
    } catch (err) {
      setErro('Erro ao salvar item: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar item:', err);
    } finally {
      setCarregando(false);
    }
  };

  const handleUploadImagem = async (e) => {
    e.preventDefault();
    if (!imagemFile) {
      setErro('Selecione uma imagem para upload');
      return;
    }

    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('file', imagemFile);
      
      const resultado = await catalogApi.uploadImagem(formData);
      setNovoItem({ ...novoItem, imagemUrl: resultado.url || resultado });
      setImagemFile(null);
    } catch (err) {
      setErro('Erro ao fazer upload da imagem: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao fazer upload:', err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Catálogos</h1>
            </div>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Novo Item
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Erro */}
        {erro && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {erro}
            <button
              onClick={() => setErro(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Formulário de Novo Item */}
        {mostrarFormulario && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Item</h2>
            <form onSubmit={handleSalvarItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoItem.nome}
                    onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={novoItem.categoria}
                    onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoItem.preco}
                    onChange={(e) => setNovoItem({ ...novoItem, preco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={novoItem.descricao}
                    onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagemFile(e.target.files[0])}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleUploadImagem}
                    disabled={!imagemFile || carregando}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    <Upload className="h-5 w-5" />
                    Upload
                  </button>
                </div>
                {novoItem.imagemUrl && (
                  <p className="mt-2 text-sm text-green-600">Imagem salva: {novoItem.imagemUrl}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={carregando}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  <Plus className="h-5 w-5" />
                  Salvar Item
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtro */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleFiltrar} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por categoria..."
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filtrar
            </button>
            {filtroCategoria && (
              <button
                type="button"
                onClick={() => {
                  setFiltroCategoria('');
                  carregarItens();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
            )}
          </form>
        </div>

        {/* Lista de Itens */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              {filtroCategoria ? `Itens em "${filtroCategoria}"` : 'Todos os Itens'}
            </h2>
          </div>

          {carregando && !itens.length ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando itens...</p>
            </div>
          ) : itens.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum item encontrado no catálogo.</p>
            </div>
          ) : (
            <div className="divide-y">
              {itens.map((item, index) => (
                <div key={item.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {item.imagemUrl && (
                      <img
                        src={item.imagemUrl}
                        alt={item.nome}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.nome}</h3>
                          {item.categoria && (
                            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {item.categoria}
                            </span>
                          )}
                          {item.descricao && (
                            <p className="mt-2 text-gray-600">{item.descricao}</p>
                          )}
                        </div>
                        {item.preco && (
                          <p className="text-xl font-bold text-green-600">
                            R$ {parseFloat(item.preco).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                          <Edit className="h-4 w-4" />
                          Editar
                        </button>
                        <button className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm">
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
