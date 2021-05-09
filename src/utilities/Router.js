class Router{
  static asRouter = async (req, res, next) => {
    const preResponse = { data: null, message: "Successfull!", error_message: null, status: 200, error: {} };
    try {
      if (this[req.method.toLowerCase()]) {
        let reponse;

        // applying midleware
        if (!Array.isArray(this.middleware) && typeof (this.middleware) === 'object')
          if (Array.isArray(this.midleware[req.method.toLowerCase()]))
            for (let mid of this.midleware[req.method.toLowerCase()])
              if (!(await mid(req, res, next)))
                return
        else if (Array.isArray(this.middleware))
          for (let mid of this.midleware)
            if (!(await mid(req, res, next)))
              return

        reponse = this[req.method.toLowerCase()]((res, req, next));
        if (typeof (reponse) === "object" && response.data) res.status(response.status || 200).json({ ...preResponse, reponse })
        else {
          const err = new Error('Invalid response type. Reponse must be object and must have data key');
          throw err
        }
      } else {
        const errr = new Error('Method not Allowed');
        err.status = 405
        throw err;
      }
    } catch (e) {
      throw e;
    }
  }
}