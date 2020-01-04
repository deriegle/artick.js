const View = require('./view');

class Response {
  constructor(content, status = 200) {
    this.content = content;
    this.status = status;
  }

  static make(content, status) {
    return new Response(content, status);
  }

  static view(view, status) {
    return Response.make(View.make(view), status);
  }

	static view(view, status = 200) {
		return Response.make(View.make(view), status);
	}

	send(res) {
    if (this.content instanceof View) {
      return res.send(this.content.content);
    }

    res.send(this.content);
	}
}

module.exports = Response;
