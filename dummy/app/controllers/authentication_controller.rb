class AuthenticationController < ApplicationController
  def create
    # @see http://stackoverflow.com/questions/9362910/rails-warning-cant-verify-csrf-token-authenticity-for-json-devise-requests
    response.headers['X-CSRF-Token'] = form_authenticity_token
    token = TokenStorage.instance.create
    cookies[:auth_token] = token
    render json: {}, status: :ok
  end

  def delete
    token = cookies[:auth_token]
    TokenStorage.instance.remove(token)
    cookies.delete :auth_token
    render json: {}, status: :gone
  end
end
