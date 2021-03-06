import { Button, DatePicker, Divider, Form, Icon, Input, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js'
import { OpportunityStatus, OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import LocationSelector from '../Form/Input/LocationSelector'
import RichTextEditor from '../Form/Input/RichTextEditor'
import TagInput from '../Form/Input/TagInput'
import OrgSelector from '../Org/OrgSelector'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, ShortInputContainer, TitleContainer } from '../VTheme/FormStyles'

const { TextArea } = Input

class OpDetailForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      startDateValue: null,
      endDateValue: null
    }
    // this.setDescriptin = this.setDescription.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // // Call validateFields here to disable the submit button when on a blank form.
    // // empty callback supresses a default which prints to the console.
    // this.props.form.validateFields(['title']);
    this.setState({ startDateValue: this.props.op.date[0] })
    this.setState({ endDateValue: this.props.op.date[1] })
  }

  setImgUrl = value => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  handleSubmit = (draftOrPublish) => {
    this.setState({
      requiredForPublish: draftOrPublish === 'publish'
    }
    , () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const op = this.props.op
          const { startDateValue, endDateValue } = this.state
          op.date = [] // Dirty work around to not change schema
          op.date.push(startDateValue, endDateValue)
          op.name = values.name
          op.subtitle = values.subtitle
          op.tags = values.tags
          op.duration = values.duration
          op.location = values.location
          op.offerOrg = values.offerOrg && values.offerOrg.key
          op.description = values.description
          op.imgUrl = values.imgUrl
          op.venue = values.venue
          op.status = draftOrPublish === 'publish'
            ? OpportunityStatus.ACTIVE
            : OpportunityStatus.DRAFT
          op.requestor =
            (this.props.op.requestor && this.props.op.requestor._id) ||
            this.props.me._id

          this.props.onSubmit(this.props.op)
        } else {
          window.scrollTo(0, 0)
          console.error('field validation error:', err)
        }
      })
    })
  }

  changeFormValue = (state, value) => {
    this.setState({
      [state]: value
    })
  }

  handleEndDateChange = value => {
    this.changeFormValue('endDateValue', value)
  }

  handleStartDateChange = value => {
    this.changeFormValue('startDateValue', value)
  }

  disabledStartDate = startDateValue => {
    const { endDateValue } = this.state
    if (this.isEitherFirstOrSecondValueNull(startDateValue, endDateValue)) {
      return false
    }
    return startDateValue.valueOf() > endDateValue.valueOf()
  }

  disabledEndDate = endDateValue => {
    const { startDateValue } = this.state
    if (this.isEitherFirstOrSecondValueNull(startDateValue, endDateValue)) {
      return false
    }
    return endDateValue.valueOf() <= startDateValue.valueOf()
  }

  isEitherFirstOrSecondValueNull = (firstValue, secondValue) => {
    return !firstValue || !secondValue
  }

  render () {
    const isTest = process.env.NODE_ENV === 'test'

    // get translated labels
    const opTitle = (
      <span>
        <FormattedMessage
          id='opTitle'
          defaultMessage='Title'
          description='activity Title label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opSubtitle = (
      <span>
        {' '}
        <FormattedMessage
          id='opSubtitle'
          defaultMessage='Subtitle'
          description='activity Subtitle label in OpDetails Form'
        />{' '}
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opCommitment = (
      <span>
        <FormattedMessage
          id='opCommitment'
          defaultMessage='Commitment'
          description='activity Commitment label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='How much time overall is likely to be required for the activity?'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opLocation = (
      <span>
        {' '}
        <FormattedMessage
          id='opLocation'
          defaultMessage='Location'
          description='activity Location label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='set the region to help find local volunteers'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opVenue = (
      <span>
        {' '}
        <FormattedMessage
          id='opVenue'
          defaultMessage='Venue'
          description='Venue label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='Enter the address where the event will be held at'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opOrganisation = (
      <span>
        {' '}
        <FormattedMessage
          id='opOrganisation'
          defaultMessage='Offer Organisation'
          description='label for Organisation offering the activity'
        />
        &nbsp;
        <Tooltip title='Which organisation is this activity for?'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opDescription = (
      <span>
        {' '}
        <FormattedMessage
          id='opDescription'
          defaultMessage='Description'
          description='activity Description label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='Give a long description of what is needed and what people will be doing.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opStartDate = (
      <span>
        {' '}
        <FormattedMessage
          id='opStartDate'
          defaultMessage='Start Date'
          description='activity start date label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='Choose your start date '>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const opEndDate = (
      <span>
        {' '}
        <FormattedMessage
          id='opEndDate'
          defaultMessage='End Date'
          description='activity end date label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='Choose your end date '>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const opImgUrl = (
      <span>
        <FormattedMessage
          id='opImgUrl'
          defaultMessage='Image Link'
          description='activity Image URL label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const opTags = (
      <FormattedMessage
        id='opTags'
        defaultMessage='Tags'
        description='Descriptions of general areas the activity relates to'
      />
    )

    const {
      getFieldDecorator
    } = this.props.form

    // Only show error after a field is touched.
    // const nameError = isFieldTouched('name') && getFieldError('name')
    const isNewOp = this.props.op._id
    const orgMembership =
      this.props.me.orgMembership &&
      this.props.me.orgMembership.map(member => member.organisation)
    const opType = this.props.op.type
    return (
      <div className='OpDetailForm'>
        <PageTitle>
          <h1>
            {isNewOp ? (
              <FormattedMessage
                id='opEdit'
                description='Title for editing Ops'
                defaultMessage='Edit your activity'
              />
            ) : opType === OpportunityType.ASK ? (
              <FormattedMessage
                id='OpDetailForm.title.opCreateAsk'
                description='Title for creating request Ops'
                defaultMessage='Create an new request'
              />)
              : opType === OpportunityType.OFFER ? (
                <FormattedMessage
                  id='OpDetailForm.title.opCreateOffer'
                  description='Title for creating offering Ops'
                  defaultMessage='Create an new offering'
                />)
                : null}
          </h1>
          <h5>
            <FormattedMessage
              id='opdetail.pagesubtitle'
              description='subTitle for creating Ops'
              defaultMessage='Check and update the details below including a time and a location for the activity you wish to run. Make sure you have all the information included for your volunteers.'
            />
          </h5>
        </PageTitle>
        <Divider />
        <Form colon={false}>

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpDetailForm.Title.label'
                    description='Section label for op title'
                    defaultMessage='What are you looking for?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpDetailForm.Title.prompt'
                  description='Section prompt for op title'
                  defaultMessage='Before our skilled volunteers get involved, they need to know how they can help. Add a title and description that tell volunteers how they can help you.'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={opTitle}
                  name='Title'
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Name is required' }]
                  })(<Input className='name' placeholder='name' maxLength={100} />)}
                </Form.Item>

                <Form.Item
                  label={opSubtitle}
                  name='Subtitle'
                >
                  {getFieldDecorator('subtitle', {
                    rules: [{ required: this.state.requiredForPublish, message: 'Subtitle is required' }]
                  })(
                    <Input className='subtitle' placeholder='short summary that appears on the listing.' />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <Form.Item label={opDescription}>
                {getFieldDecorator('description', {
                  rules: []
                })(
                  isTest ? (
                    <TextArea
                      rows={20}
                      placeholder='All the details about the request.'
                    />
                  ) : (
                    <RichTextEditor />
                  )
                )}
              </Form.Item>
              {orgMembership && (
                <Form.Item label={opOrganisation}>
                  {getFieldDecorator('offerOrg', {
                    rules: [{ required: true, message: 'Please select organisation' }]
                  })(
                    <OrgSelector className='organisation' orgs={orgMembership} />
                  )}
                </Form.Item>
              )}
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpDetailForm.location.label'
                    description='Section label for op location'
                    defaultMessage='Where and when?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpDetailForm.location.prompt'
                  description='Section prompt for op location'
                  defaultMessage='More skilled volunteers will offer to help you if you know when, or where you need help.'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={opCommitment}
                  name='Commitment'
                >
                  {getFieldDecorator('duration', {
                    rules: [
                      {
                        required: this.state.requiredForPublish,
                        message: 'Commitment level is required'
                      }
                    ]
                  })(<Input className='commitment' placeholder='4 hours' />)}
                </Form.Item>
                <Form.Item
                  label={opStartDate}
                  name='Start date'
                >
                  {getFieldDecorator('startDate', {
                    rules: [
                      {
                        required: false,
                        message: 'Start date is required'
                      }
                    ]
                  })(
                    <DatePicker
                      showTime
                      disabledDate={current => {
                        return (
                          moment().add(-1, 'days') >= current ||
                          moment().add(1, 'year') <= current
                        )
                      }}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.handleStartDateChange}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label={opEndDate}
                  name='End date'
                >
                  {getFieldDecorator('endDate', {
                    rules: [
                      {
                        required: false,
                        message: 'End date is required'
                      }
                    ]
                  })(
                    <DatePicker
                      showTime
                      disabledDate={this.disabledEndDate}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.handleEndDateChange}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <MediumInputContainer>
                <Form.Item label={opLocation}>
                  {getFieldDecorator('location', {
                    rules: []
                  })(
                    <LocationSelector
                      existingLocations={this.props.existingLocations}
                    />
                  )}
                </Form.Item>
                <Form.Item label={opVenue}>
                  {getFieldDecorator('venue', {
                    rules: [
                      {
                        required: false,
                        message: 'A venue or address of event must be provided'
                      }
                    ]
                  })(<Input placeholder='Venue' />
                  )}
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpDetailForm.tags.label'
                    description='Section label for op tags'
                    defaultMessage='Do you need any specific skills or resources?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpDetailForm.tags.prompt'
                  description='Section prompt for op tags'
                  defaultMessage='Does what you are asking for fit into any specific categories like programming, electronics, or robots? Enter them here to make it easier for volunteers to find you.'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={opTags}>
                {getFieldDecorator('tags', {
                  initialValue: [],
                  rules: []
                })(<TagInput existingTags={this.props.existingTags} />)}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Add an image (optional)</h3>
              </TitleContainer>
              <p>
                Requests with photos get more responses. If you don't have a
                photo leave blank and we will provide one based on the category.
              </p>
              <img
                style={{ width: '50%', float: 'right' }}
                src={this.props.op.imgUrl}
                alt='current image'
              />
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={opImgUrl}>
                  {getFieldDecorator('imgUrl', {
                    rules: [{ required: this.state.requiredForPublish, message: 'Please upload an image' }]
                  })(<Input />)}
                  <ImageUpload setImgUrl={this.setImgUrl} />
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Confirm request</h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='op.SaveInstructions'
                  defaultMessage='Save as Draft will allow you to preview the request while Publish will make it available to everyone to view.'
                  description='Instructions for save and publish on activity details form'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Button
                id='cancelOpBtn'
                type='secondary'
                htmlType='button'
                onClick={this.props.onCancel}
              >
                <FormattedMessage
                  id='op.cancel'
                  defaultMessage='Cancel'
                  description='Label for cancel button on activity details form'
                />
              </Button>
              <Button
                id='saveOpBtn'
                name='save'
                onClick={() => this.handleSubmit('draft')}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='op.editSaveDraft'
                  defaultMessage='Save as draft'
                  description='Label for save as draft button on activity details form'
                />
              </Button>
              <Button
                id='publishOpBtn'
                name='publish'
                type='primary'
                onClick={() => this.handleSubmit('publish')}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='op.editPublish'
                  defaultMessage='Publish'
                  description='Label for submit button on activity details form'
                />
              </Button>
            </InputContainer>
          </FormGrid>
        </Form>
      </div>
    )
  }
}

OpDetailForm.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    duration: PropTypes.string,
    location: PropTypes.string,
    offerOrg: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string
      })
    ]),
    date: PropTypes.array,
    status: PropTypes.string,
    // requestor: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    organisationVenue: PropTypes.string

  }),
  me: PropTypes.shape({
    _id: PropTypes.string,
    orgMembership: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string
      })
    )
  }),
  form: PropTypes.object,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'opportunity_detail_form',
  onFieldsChange (props, changedFields) {
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      name: Form.createFormField({ ...props.op.name, value: props.op.name }),

      subtitle: Form.createFormField({
        ...props.op.subtitle,
        value: props.op.subtitle
      }),
      description: Form.createFormField({
        ...props.op.description,
        value: props.op.description
      }),
      duration: Form.createFormField({
        ...props.op.duration,
        value: props.op.duration
      }),
      location: Form.createFormField({
        ...props.op.location,
        value: props.op.location
      }),
      offerOrg: Form.createFormField({
        ...props.op.offerOrg,
        value: { key: props.op.offerOrg ? props.op.offerOrg._id : '' }
      }),
      imgUrl: Form.createFormField({
        ...props.op.imgUrl,
        value: props.op.imgUrl
      }),
      status: Form.createFormField({
        ...props.op.status,
        value: props.op.status
      }),
      tags: Form.createFormField({
        ...props.op.tags,
        value: props.op.tags
      }),
      startDate: Form.createFormField({
        ...props.op.startDate,
        value: props.op.startDate != null ? moment(props.op.startDate) : null
      }),
      endDate: Form.createFormField({
        ...props.op.endDate,
        value: props.op.endDate != null ? moment(props.op.endDate) : null
      }),
      venue: Form.createFormField({
        ...props.op.venue,
        value: props.op.venue || ''
      })
    }
  }

})(OpDetailForm)
