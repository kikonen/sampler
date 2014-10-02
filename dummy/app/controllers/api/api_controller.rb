module Api
  class ApiController < ApplicationController
    before_filter :require_authentication

    def require_authentication
      token = cookies[:auth_token]
      logger.info "token: #{token}"

      valid = TokenStorage.instance.valid?(token)
      unless valid
        logger.info "try basic_auth"
        valid = authenticate_with_http_basic do |username, password|
          password == 'password'
        end
      end

      logger.info "login: #{valid}"

      unless valid
        render json: { error_code: :unauthorized }, status: :unauthorized
      end
    end
  end
end
