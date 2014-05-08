#
# Support for CORS calls
#
# Sample implementation
#
# USAGE:
#
# app/controllers/application_controller.rb:
# ApplicationController <
#   include CorsHelper
#   before_filter :cors_preflight_check
#   after_filter :cors_set_access_control_headers
#
# config/routes.rb:
#   match '*path', to: 'application#cors_options', via: [:options]
#
module CorsHelper
  CORS_FIXED_HEADERS = {
    'Access-Control-Allow-Methods' => %w(POST GET DELETE PUT PATCH OPTIONS).join(', '),
    'Access-Control-Allow-Credentials' => 'true',
    'Access-Control-Max-Age' => '1728000',
  }
  CORS_PREFLIGHT_HEADERS = CORS_FIXED_HEADERS.merge({
      'Access-Control-Allow-Headers' => %w(X-CSRF-Token X-Requested-With X-Prototype-Version Authorization Content-Type).join(', ')
  })
  CORS_HEADER_ALLOW_ORIGIN = 'Access-Control-Allow-Origin'
  CORS_HTTP_ORIGIN = 'HTTP_ORIGIN'

  #
  # Answer cors options call
  #
  def cors_options
    head :ok
  end

  #
  # For all responses in this controller, return the CORS access control headers.
  #
  def cors_set_access_control_headers
    headers[CORS_HEADER_ALLOW_ORIGIN] = request.headers[CORS_HTTP_ORIGIN]
    CORS_FIXED_HEADERS.each do |k, v|
      headers[k] = v
    end
  end

  #
  # If this is a preflight OPTIONS request, then short-circuit the
  # request, return only the necessary headers and return an empty
  # text/plain.
  #
  def cors_preflight_check
    headers[CORS_HEADER_ALLOW_ORIGIN] = request.headers[CORS_HTTP_ORIGIN]
    CORS_PREFLIGHT_HEADERS.each do |k, v|
      headers[k] = v
    end
  end
end
