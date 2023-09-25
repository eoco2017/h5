import Vue from 'vue';
import { Row, Col, Card, Tabs, TabPane, Tag, Pagination, Divider, Radio, RadioGroup, Checkbox, CheckboxGroup, Input, Icon, Breadcrumb, BreadcrumbItem, MessageBox, Message, Button, Image,} from 'element-ui';
Vue.use(Row).use(Col).use(Card).use(Tabs).use(TabPane).use(Tag).use(Pagination).use(Divider).use(Radio).use(RadioGroup).use(Checkbox).use(CheckboxGroup).use(Input).use(Icon).use(Breadcrumb).use(BreadcrumbItem).use(Button).use(Image)
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
