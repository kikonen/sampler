Dummy::Application.routes.draw do
  mount Sampler::Engine, at: "/sampler"

  # @see http://omarriott.com/aux/angularjs-html5-routing-rails/
  match "/sampler/*path" => redirect("/sampler/?path=%{path}")

  namespace :api, defaults: {format: :json} do
    get 'tasks', to: 'task#index'
    get 'tasks/:id', to: 'task#show'
    post 'tasks', to: 'task#create'
    put 'tasks/:id', to: 'task#update'
    delete 'tasks/:id', to: 'task#delete'

    get 'upload', to: 'upload#get_upload'
    post 'upload', to: 'upload#post_upload'
    put 'upload', to: 'upload#put_upload'

    get 'login', to: 'login#create'
    delete 'login', to: 'login#delete'
  end

  get 'auth/token', to: 'authentication#create'
  delete 'auth/token', to: 'authentication#delete'

end
