require 'spec_helper'

describe 'capybara', type: :feature  do
  include Angular::DSL

  it 'test' do
    visit 'http://localhost:4000/sampler'

    p ng_set_location '/hello'
    expect(ng_location_abs).to end_with '/hello'

    ng_wait
    ap ng_location
    ap ng_eval '1 + 1'

    ng_repeater_row('view in views', row: 1).click
    expect(ng_model('server.url').value).to eq ''
    expect(ng_binding('hello').visible_text).to eq 'foo'
    expect(ng_option("r for r in ['GET', 'POST', 'PUT', 'DELETE']").visible_text).to eq 'GET'

    # trying out various node query options

    p "==== ng_options"
    p ng_options("r for r in ['GET', 'POST', 'PUT', 'DELETE']")
    p ng_options("r for r in ['GET', 'POST', 'PUT', 'DELETE']").map(&:visible_text)
    p ng_option("r for r in ['GET', 'POST', 'PUT', 'DELETE']", row: 1).visible_text

    p "==== ng_bindings"
    p ng_bindings('hello')
    p ng_bindings('hello').map(&:visible_text)
    p ng_binding('hello', row: 1).visible_text

    p "==== ng_models"
    p ng_models('server.url')
    p ng_models('server.url').map(&:value)
    p ng_model('server.url').value

    p "==== ng_repeater_rows"
    p ng_repeater_rows('row in tableData')
    p ng_repeater_rows('row in tableData').map { |n| n['class'] }
    p ng_repeater_row('row in tableData', row: 2)['class']

    p "==== ng_repeater_columns"
    p ng_repeater_columns('row in tableData', '{{row.color}}')
    p ng_repeater_columns('row in tableData', '{{row.color}}').map(&:visible_text)
    p ng_repeater_column('row in tableData', '{{row.color}}', row: 1).visible_text

    p "==== ng_repeater_elements"
    p ng_repeater_elements('row in tableData', 1, '{{row.color}}')
    p ng_repeater_elements('row in tableData', 1, '{{row.color}}').map(&:visible_text)
    p ng_repeater_element('row in tableData', 1, '{{row.color}}', row: 1).visible_text
  end
end
