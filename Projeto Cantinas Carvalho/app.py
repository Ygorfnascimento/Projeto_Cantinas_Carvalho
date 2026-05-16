from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('produto.html')

@app.route('/admin/produtos')
def produtos():
    return render_template('produto.html')

@app.route('/admin/pedidos')
def pedidos():
    return render_template('pedido.html')

@app.route('/admin/relatorios')
def relatorios():
    return render_template('relatorio.html')

@app.route('/admin/usuarios')
def usuarios():
    return render_template('usuario.html')

@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)