class HomeController {
  index(req, res) {
    res.redirect('/welcome')
  }
  welcome(req, res) {
    res.render('welcome', {
      cssfile: 'welcome.css'
    })
  }
  // test(req, res) {
  //   res.render('test', {
  //     cssfile: 'test.css'
  //   })
  // }
  result(req, res) {
    res.render('result', {
      cssfile: 'result.css'
    })
  }
}

module.exports = new HomeController
