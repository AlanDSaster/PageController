class PageController {
	/* 
	Creates an object that tracks page navigation for an express application using express-session, dotenv, and the handlebars webpage template engine.
	Requires that the user provide a req object and accepts an 'args' object for potential parameter override
	If args contains a variable that matches a variable that would normally be retrieved from req.body, then the variable declared in args will be used.
	If no variable is provided in either args or req.body, the PageController will fall back to using a variable declared in the .env file.
	If no variable is provided in the .env file, the PageController will attempt to default to a hardcoded logical choice.
	
	supported args variables:
		array		: overrides the data being pushed to the PageController. Use this if the client needs a different set of data than initially queried
		pagesize	: overrides the number of items served to the client's viewport
		destination	: overrides the page number the user will land on when the results are served

	*/
	constructor(req, args) {
		this.array = args?.array ?? req.session.pagecontroller?.array ?? [];
		this.pagesize = (() => {
			let x = args?.pagesize ?? req.body.pagesize ?? process.env.PAGESIZE_DEFAULT;
			x = Math.max(Math.min(x, process.env.PAGESIZE_MAXIMUM), process.env.PAGESIZE_MINIMUM);
			return parseInt(x);
		})();
		this.current = (() => {
			let x = args?.destination ?? req.body.destination ?? req.session.pagecontroller?.current ?? 1;
			x = Math.max(Math.min(x, this.array.length), 1);
			return parseInt(x);
		})();
		let i_from = (() => {
			let x = (this.current - 1) * this.pagesize;
			return parseInt(x);
		})();
		let i_to = (() => {
			let x = i_from + this.pagesize;
			return parseInt(x);
		})();
		this.first = 1;
		this.last = parseInt(Math.ceil(this.array.length / this.pagesize));
		this.next = Math.min(this.current + 1, this.last);
		this.previous = Math.max(this.current - 1, 1);
		this.page = this.array.slice(i_from, i_to);
		this.locals = {
			current	: parseInt(this.current),
			first	: parseInt(this.first),
			last	: parseInt(this.last),
			next	: parseInt(this.next),
			previous: parseInt(this.previous),
			page 	: parseInt(this.page)
		};
		req.session.pagecontroller = this;
	}
};

module.exports = PageController;