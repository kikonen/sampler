Sampler::Engine.routes.draw do
  root to: 'static#index'

  # @see http://omarriott.com/aux/angularjs-html5-routing-rails/
#  match "/*path" => redirect("/?path=%{path}")
end
