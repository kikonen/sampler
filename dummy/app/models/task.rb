class Task
  attr_reader :values
  delegate :id, :name, :message, :done, :[], :[]=, to: :values

  def initialize(values = {})
    @values = Hashie::Mash.new(values.clone)
  end

  def self.all
    TaskStorage.instance.all
  end

  def self.find(id)
    TaskStorage.instance.find(id)
  end

  def save
    TaskStorage.instance.save(self)
  end

  def delete
    TaskStorage.instance.delete(id)
  end

end
