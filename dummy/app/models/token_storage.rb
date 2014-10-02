class TokenStorage
  include Singleton

  def initialize
    @tokens = []
  end

  def create
    token = SecureRandom.uuid
    @tokens << token
    logger.info "add: #{token}"
    logger.info @tokens
    token
  end

  def valid?(token)
    logger.info "valid: #{token}"
    logger.info @tokens
    @tokens.include?(token)
  end

  def remove(token)
    logger.info "delete: #{token}"
    @tokens.delete(token)
    logger.info @tokens
  end
end
