Dummy::Application.routes.draw do
  mount Sampler::Engine, at: "/sampler"
end
