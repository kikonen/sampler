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

      if defined? Slim
        Rails.application.assets.register_engine('.slim', Slim::Template)
      end

      if Rails.env.development?
        # Indent html for pretty debugging and do not sort attributes (Ruby 1.9)
        Slim::Engine.set_default_options pretty: true, sort_attrs: false
      end
    end
  end
end
