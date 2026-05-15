from flask import Flask, render_template, abort

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('produto.html')

def render_page(template):
    try:
        return render_template(template)
    except Exception:
        abort(404)

@app.route('/admin/produtos')
def produtos():
    return render_page('produto.html')

@app.route('/admin//pedidos')
def pedidos():
    return render_page('pedido.html')

@app.route('/admin//relatorios')
def relatorios():
    return render_page('relatorio.html')

@app.route('/admin//usuarios')
def usuarios():
    return render_page('usuario.html')

@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)