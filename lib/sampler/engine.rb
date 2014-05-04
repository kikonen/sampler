module Sampler
  class Engine < ::Rails::Engine
    isolate_namespace Sampler

    # initializer "sampler.load_app_instance_data" do |app|
    #   Sampler.setup do |config|
    #     config.app_root = app.root
    #   end
    # end

    initializer "sampler.load_static_assets" do |app|
      app.middleware.use ::ActionDispatch::Static, "#{root}/public"
    end
  end
end
