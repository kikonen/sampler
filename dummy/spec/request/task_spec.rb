require 'spec_helper'

describe 'capybara', type: :feature  do
  it 'create task' do
    visit 'http://localhost:4000/sampler'

    init_task_count = 2

    expect(ng_eval('1 + 1')).to eq 2
    expect(ng_location()).to eq '/home'
    expect(ng_location_abs()).to eq 'http://localhost:4000/sampler/home'

    # login
    ng_repeater_row('view in views', row: 0).click

    have_field('foobar')
    has_field?('foobar')
#    find_field('foobar')
    have_ng_model('user.username2')
    has_ng_model?('user.username2')
#    ng_model('user.username2')

    expect(page).to have_ng_model('user.username')
    ng_model('user.username').set('admin')
    ng_model('user.password').set('password')
    click_button 'Login'

    # check initial state
    ng_repeater_row('view in views', row: 2).click
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
