module Api
  class UploadController < ApiController
    def get_upload
      ap get: params
      logger.info "upload"
      head :ok
    end

    def post_upload
      ap post: params
      logger.info "upload"
      file = params[:file].tempfile
      target_file = File.join(Rails.root, "tmp", "foo.txt")
      FileUtils.cp(file, target_file)
      ap sz: File.size(target_file), name: target_file.to_s
      head :ok
    end

    def put_upload
      ap put: params
      logger.info "upload"
      head :ok
    end
  end
end
