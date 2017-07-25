class OnlyDashboard < ActiveAdmin::AuthorizationAdapter
  def authorized?(action, subject = nil)
    case subject
    when ActiveAdmin::Page
      action == :read &&
        subject.name == "Dashboard" &&
        subject.namespace.name == :admin
    else
      false
    end
  end
end
