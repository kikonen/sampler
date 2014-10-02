require 'spec_helper'

describe 'capybara', type: :feature  do
  include Angular::DSL

  it 'create task' do
    visit 'http://localhost:4000/sampler'

    init_task_count = 2

    # login
    ng_repeater_row('view in views', 0).click
    ng_model('user.username').set('admin')
    ng_model('user.password').set('password')
    click_button 'Login'

    # check initial state
    ng_repeater_row('view in views', 2).click
    expect(ng_repeater_rows('task in $data').length).to eq init_task_count

    # create new task
    click_link 'New Task'
    ng_model('task.name').set('Some')
    ng_model('task.message').set('Thing')
    ng_model('task.done').set('true')
    click_button 'Save'

    # check task is created
    rows = ng_repeater_columns('task in $data', 'task.name')
    expect(rows.length).to eq init_task_count + 1

    # delete created task
    cell = rows.select { |row| row.visible_text == 'Some' }.first
    cell.click
    accept_alert do
      click_button 'Delete'
    end
    expect(ng_repeater_rows('task in $data').length).to eq init_task_count
  end
end
