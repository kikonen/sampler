$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'sampler/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'sampler'
  s.version     = Sampler::VERSION
  s.authors     = ['Kari Ikonen']
  s.email       = ['mr.kari.ikonen@gmail.com']
  s.homepage    = 'http://kari.dy.fi'
  s.summary     = 'API sampler'
  s.description = 'AngularJS based tester for REST APIs.'

  s.files = Dir['{app,config,db,lib}/**/*'] + ['MIT-LICENSE', 'Rakefile', 'README.rdoc']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'rails', '~> 3.2.17'
  # s.add_dependency 'jquery-rails'
  s.add_dependency 'hashie'
  s.add_dependency 'logging-rails'
  s.add_dependency 'awesome_print'

  # For assets pipeline
  s.add_dependency 'ngmin-rails'
  s.add_dependency 'bootstrap-sass', '~> 2.3.1.0'
  s.add_dependency 'sass-rails',   '~> 3.2.3'
  s.add_dependency 'therubyracer'
  s.add_dependency 'uglifier', '>= 1.0.3'

  s.add_development_dependency 'bower-rails'
  s.add_development_dependency 'sqlite3'
  s.add_development_dependency 'pry-rails'
end
