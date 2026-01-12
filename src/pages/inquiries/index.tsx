import { Avatar, Col, Empty, Flex, Form, Row, Skeleton, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { Button, ChaiiText } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChaiInput from "src/components/input";
import { ROUTES } from "src/constants/navigation-routes";
import { getAuthenticationData } from "src/store/selectors/features/authentication";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import {
  getInquiresData,
  getInquiresList,
  getInquiresMeta,
} from "src/store/selectors/features/inquiries-selector";
import {
  getMessagesData,
  getMessagesList,
  getMessagesMeta,
  getNewMessageData,
  messagesLoading,
} from "src/store/selectors/features/messages-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleClearGetResourceById } from "src/store/slices/features/get-resource-by-id";
import { toggleUpdateGetInquires } from "src/store/slices/features/inquiries-reducer";
import { toggleNewMessage } from "src/store/slices/features/messages-reducer";
import { colors } from "src/styles/colors";
import { getRandomColor, returnTimeAndDate } from "src/utils/functions";
import styles from "./styles.module.scss";

interface inquiresList {
  resourceFirstName: string;
  resourceLastName?: string;
  id: string;
  resourceId: string;
  endUserFirstName: string;
  endUserLastName: string;
  resourceJobTitle: string;
}

interface inquiriesProps {
  page: number;
  limit?: number;
  resourceId?: string;
  search?: string;
  endUserId?: string;
  partnerId?: string;
}

export const Inquries = () => {
  const [form] = useForm();
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState<inquiresList | null>(null);
  const [page, setPage] = useState(1);
  const [pageInquires, setPageInquires] = useState(1);
  const list: any = useSelector(getInquiresList);
  const meta: any = useSelector(getMessagesMeta);
  const metaInquires: any = useSelector(getInquiresMeta);
  const data: any = useSelector(getMessagesData);
  const user: any = useSelector(getCurrentUserData);
  const isSendingMessage = useSelector(messagesLoading);
  const scrollRef = useRef<any>(null);
  const scrollRefInquires = useRef(null);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [inquiriesList, setinquiresList] = useState<any[]>([]);
  const messages = useSelector(getMessagesList);
  const loggedInUser: any = useSelector(getAuthenticationData);
  const newMessage: any = useSelector(getNewMessageData);
  const [scrollFetch, setScrollFetch] = useState(false);
  const [scrollFetchInquires, setScrollFetchInquires] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const inquiresData: any = useSelector(getInquiresData);

  const dispatch = useDispatch();
  const isRecevier = (id: string) => {
    return id === (user?.partnerId || user?.id) ? false : true;
  };

  const updateList = (id: string) => {
    if (Array.isArray(inquiriesList) && inquiriesList?.length > 0) {
      const arr = inquiriesList?.map((i: any) => {
        if (i?.id === id) {
          return {
            ...i,
            unreadCount: 0,
          };
        } else return i;
      });
      setinquiresList(arr);
      dispatch(toggleUpdateGetInquires({ ...inquiresData, items: arr }));
    }
  };

  useEffect(() => {
    if (Array.isArray(list) && list?.length > 0 && initialLoading) {
      setInitialLoading(false);
      const id = list[0]?.id;
      const resourceFirstName = list[0]?.resourceFirstName;
      const resourceLastName = list[0]?.resourceLastName;
      const resourceJobTitle = list[0]?.resourceJobTitle;
      const resourceId = list[0]?.resourceId;
      const endUserFirstName = list[0]?.endUserFirstName;
      const endUserLastName = list[0]?.endUserLastName;
      setinquiresList(list);
      setSelectedChat({
        resourceFirstName,
        resourceLastName,
        id,
        resourceId,
        endUserFirstName,
        endUserLastName,
        resourceJobTitle,
      });
    }
  }, [inquiresData]);

  const getInquires = () => {
    const query: inquiriesProps = {
      page: page,
    };
    dispatch(
      RequestAppAction.handleGetInquires({
        query: query,
        cbSuccess: (res) => {
          setInitialLoading(false);
          if (res?.items?.length > 0) {
            const id = res?.items[0]?.id;
            const resourceFirstName = res?.items[0]?.resourceFirstName;
            const resourceLastName = res?.items[0]?.resourceLastName;
            const resourceJobTitle = res?.items[0]?.resourceJobTitle;
            const resourceId = res?.items[0]?.resourceId;
            const endUserFirstName = res?.items[0]?.endUserFirstName;
            const endUserLastName = res?.items[0]?.endUserLastName;
            setinquiresList(res?.items);
            setSelectedChat({
              resourceFirstName,
              resourceLastName,
              id,
              resourceId,
              endUserFirstName,
              endUserLastName,
              resourceJobTitle,
            });
          }
        },
        cbFailure: () => {
          setInitialLoading(false);
        },
      })
    );
  };

  const onSelectInquires = (id: string) => {
    dispatch(
      RequestAppAction.handleGetMessages({
        id: id,
        cbSuccess: (res) => {
          setPage(1);
          setMessagesList(res?.items);
          setTimeout(() => {
            scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
          }, 800);
        },
      })
    );
  };

  useEffect(() => {
    getInquires();
    return () => {
      dispatch(toggleNewMessage(null));
    };
  }, []);

  useEffect(() => {
    if (selectedChat?.id) {
      onSelectInquires(selectedChat?.id);
    }
  }, [selectedChat]);

  const sendMessage = (message: string, resourceId: string) => {
    if (selectedChat) {
      form.setFieldValue("message", null);
      dispatch(
        RequestAppAction.handleSendMessage({
          data: { content: message, resourceId: resourceId },
          id: selectedChat?.id,
          cbSuccess: (res) => {
            setMessagesList([res, ...messagesList]);

            setTimeout(() => {
              scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
            }, 500);
          },
          cbFailure: () => {
            form.setFieldValue("message", message);
          },
        })
      );
    }
  };

  useEffect(() => {
    if (scrollFetch && selectedChat) {
      dispatch(
        RequestAppAction.handleGetMessages({
          id: selectedChat?.id,
          data: {
            page: page + 1,
          },
          cbSuccess: (res) => {
            if (selectedChat?.id) {
              updateList(selectedChat?.id);
            }
            setMessagesList([...messagesList, ...res?.items]);
            setPage(page + 1);
            setScrollFetch(false);
          },
        })
      );
    }
  }, [scrollFetch]);

  useEffect(() => {
    if (scrollFetchInquires) {
      dispatch(
        RequestAppAction.handleGetInquires({
          query: {
            page: page + 1,
          },
          cbSuccess: (res) => {
            if (selectedChat?.id) {
              const arr = inquiriesList?.map((i: any) => {
                if (i.id === selectedChat?.id) {
                  return {
                    ...i,
                    unreadCount: 0,
                  };
                } else return i;
              });
              setinquiresList([...arr, ...res?.items]);
              dispatch(
                toggleUpdateGetInquires({ ...inquiresData, items: arr })
              );
            } else {
              setinquiresList([...inquiriesList, ...res?.items]);
            }

            setPageInquires(page + 1);
            setScrollFetchInquires(false);
          },
        })
      );
    }
  }, [scrollFetchInquires]);

  const onScrollInquries = () => {
    if (scrollRefInquires.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollRefInquires.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom) {
        if (pageInquires < metaInquires?.totalPages) {
          setScrollFetchInquires(true);
        }
      }
    }
  };

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearTop = clientHeight - scrollHeight;

      if (-scrollTop + 10 > -isNearTop) {
        if (page < meta?.totalPages) {
          setScrollFetch(true);
        }
      }
    }
  };

  useEffect(() => {
    const listInnerElement: any = scrollRef?.current;

    if (listInnerElement) {
      listInnerElement.addEventListener("scroll", onScroll);

      return () => {
        listInnerElement.removeEventListener("scroll", onScroll);
      };
    }
  }, [data, page]);

  useEffect(() => {
    const listInnerElement: any = scrollRefInquires?.current;

    if (listInnerElement) {
      listInnerElement.addEventListener("scroll", onScrollInquries);

      return () => {
        listInnerElement.removeEventListener("scroll", onScrollInquries);
      };
    }
  }, [list, pageInquires]);

  const [searchValue, setSearchValue] = useState("");
  const [initial, setInitial] = useState(true);

  const onSearch = (val: string) => {
    dispatch(
      RequestAppAction.handleGetInquires({
        query: {
          page: 1,
          search: val,
        },
        cbSuccess: (res) => {
          if (res?.items?.length > 0) {
            setinquiresList([...res?.items]);
            setSelectedChat({
              resourceFirstName: res?.items[0]?.resourceFirstName,
              resourceLastName: res?.items[0]?.resourceLastName,
              resourceJobTitle: res?.items[0]?.resourceJobTitle,
              id: res?.items[0]?.id,
              resourceId: res?.items[0]?.resourceId,
              endUserFirstName: res?.items[0]?.endUserFirstName,
              endUserLastName: res?.items[0]?.endUserLastName,
            });
            setPageInquires(1);
            setScrollFetchInquires(false);
            dispatch(
              RequestAppAction.handleGetMessages({
                id: res?.items[0]?.id,
                data: {
                  page: 1,
                },
                cbSuccess: (res) => {
                  if (res?.items?.length > 0) {
                    setMessagesList([...res?.items]);
                    setPage(1);
                    setScrollFetch(false);
                  } else {
                    setMessagesList([]);
                  }
                },
              })
            );
          } else {
            setinquiresList([]);
            setMessagesList([]);
            setSelectedChat(null);
          }
        },
      })
    );
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!initial) {
        if (onSearch) onSearch(searchValue);
      } else {
        setInitial(false);
      }
    }, 1000);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchValue]);

  useEffect(() => {
    // test this logic
    const query: inquiriesProps = {
      page: page,
    };
    // fetch new inquires

    if (!initialLoading && newMessage?.inquiryId)
      dispatch(
        RequestAppAction.handleGetInquires({
          query: query,
          cbSuccess: (res) => {
            // checking if there are any new inquiries
            if (Array.isArray(res?.items)) {
              // Filter items in res.items that do not exist in inquiriesList
              const existingIds = inquiriesList.map((inquiry) => inquiry.id);
              const newItems =
                res?.items?.filter(
                  (item: { id: string }) => !existingIds.includes(item.id)
                ) || [];

              const itemsMap = new Map(
                res?.items?.map((item: { id: string; unreadCount: number }) => [
                  item.id,
                  item,
                ])
              );

              const updatedItems = inquiriesList.map((inquiry) => {
                const matchingItem: any = itemsMap.get(inquiry.id);
                return {
                  ...inquiry,
                  unreadCount:
                    selectedChat?.id === inquiry?.id
                      ? 0
                      : matchingItem?.unreadCount ?? inquiry.unreadCount,
                };
              });

              // Identify new items not already in inquiriesList

              // If there are new items, add them on top of the list
              if (newItems.length > 0) {
                setinquiresList([...newItems, ...updatedItems]);
                dispatch(
                  toggleUpdateGetInquires({
                    ...inquiresData,
                    items: [...newItems, ...updatedItems],
                  })
                );
              } else {
                setinquiresList([...updatedItems]);
                dispatch(
                  toggleUpdateGetInquires({
                    ...inquiresData,
                    items: [...updatedItems],
                  })
                );
              }
            }
            // checking if the inquiryId matches with the currently selected inquiry id then add new message in the list
            if (
              newMessage?.inquiryId === selectedChat?.id &&
              newMessage !== null
            ) {
              const newObj = {
                id: newMessage?.id || Math.random(),
                inquiryId: newMessage?.inquiryId,
                content: newMessage?.message,
                senderId: newMessage?.senderId,
                readAt: newMessage?.readAt || new Date(),
                sentAt: newMessage?.sentAt || new Date(),
                repliedAt: newMessage?.repliedAt || new Date(),
                resourceId: newMessage?.resourceId,
              };
              setMessagesList([newObj, ...messagesList]);
            }
          },
        })
      );
  }, [newMessage]);

  const navigate = useNavigate();
  return (
    <Content className={styles.main_container}>
      <div className="w-100 p-2 h-100 d-flex ">
        <div style={{ flexGrow: 0 }} className="p-2 h-100">
          <Flex className={`${styles.card} border overflow-hidden`}>
            <Content className="d-flex flex-column h-100">
              <ChaiInput
                onChange={(e) => setSearchValue(e?.target?.value)}
                name="search"
                placeholder={t("input.search")}
              />

              <div ref={scrollRefInquires} className="p-2 h-100  overflow-auto">
                <Skeleton loading={initialLoading}>
                  {inquiriesList?.length > 0 ? (
                    inquiriesList?.map(
                      (
                        {
                          resourceId,
                          id,
                          resourceFirstName,
                          resourceLastName,
                          endUserFirstName,
                          endUserLastName,
                          unreadCount,
                          resourceJobTitle,
                        },
                        index
                      ) => (
                        <Content
                          key={`${index}`}
                          onClick={() => {
                            if (!isSendingMessage) {
                              setSelectedChat({
                                resourceId,
                                resourceFirstName,
                                id,
                                endUserFirstName,
                                endUserLastName,
                                resourceLastName,
                                resourceJobTitle,
                              });
                              updateList(id);
                            }
                          }}
                          className={`mt-2 p-2 flex-column d-flex  border rounded-2 cursor-pointer ${
                            selectedChat?.id === id
                              ? `${styles.selected_chat}  py-2`
                              : ""
                          }`}
                        >
                          <h6
                            className={`text-truncate d-flex gap-1 mb-0 ${styles.chat_text}`}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Inquiry from{" "}
                            <h6 className={`${styles.chat_text_fname} fw-bold`}>
                              {(endUserFirstName ?? "") +
                                " " +
                                (endUserLastName ?? "")}
                            </h6>
                          </h6>
                          <Flex justify="space-between">
                            <div className="d-flex gap-2 align-items-center justify-content-start">
                              <Avatar
                                style={{
                                  background: getRandomColor(resourceFirstName),
                                  color: colors.black,
                                  height: "2.2rem",
                                  width: "2.2rem",
                                }}
                              >
                                {resourceFirstName?.charAt(0)?.toUpperCase()}
                              </Avatar>
                              <div className="d-flex gap-1 flex-column align-items-start justify-content-start">
                                <ChaiiText className={styles.chat_text_fname}>
                                  {resourceFirstName ?? ""}
                                </ChaiiText>
                                <ChaiiText className={styles.chat_text}>
                                  {resourceLastName ?? ""}
                                </ChaiiText>
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              {unreadCount > 0 ? (
                                <div className={styles.notification_dot} />
                              ) : (
                                <></>
                              )}
                            </div>
                          </Flex>

                          {/* <Avatar
                            style={{
                              background: getRandomColor(resourceFirstName),
                              color: colors.black,
                              height: "2rem",
                              width: "2rem",
                            }}
                            size={50}
                            key={id}
                          >
                            {resourceFirstName?.charAt(0).toUpperCase()}
                          </Avatar>
                          <ChaiiText className={styles.chat_text}>
                            {resourceFirstName + " " + resourceLastName}
                          </ChaiiText> */}
                        </Content>
                      )
                    )
                  ) : (
                    <div className="h-100  justify-content-center align-items-center d-flex">
                      <Empty />
                    </div>
                  )}
                </Skeleton>
              </div>
            </Content>
          </Flex>
        </div>
        <div style={{ flexGrow: 1 }} className="p-2 h-100 ">
          <Content className={`${styles.card} position-relative border `}>
            <div
              style={{
                left: 0,
                right: 0,
                margin: "auto",
              }}
              className="position-absolute d-flex w-100   z-1 p-0"
            >
              {selectedChat ? (
                <div
                  style={{ marginLeft: "1.5rem", marginRight: "1.5rem" }}
                  className="w-100  bg-gradient bg-white d-flex flex-grow-1 border align-items-center justify-content-between  rounded-2 p-2 "
                >
                  <div
                    onClick={() => {
                      dispatch(toggleClearGetResourceById());
                      if (selectedChat)
                        navigate(
                          ROUTES.RESOURCE_PROFILE_REPLACE.replace(
                            ":id",
                            selectedChat?.resourceId
                          )
                        );
                    }}
                    className="d-flex flex-column align-self-start align-items-start cursor-pointer justify-content-start"
                  >
                    <h6
                      className={`text-truncate d-flex gap-1 mb-0 ${styles.chat_text}`}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Inquiry from{" "}
                      <h6 className={`${styles.chat_text_fname} fw-bold`}>
                        {(selectedChat?.endUserFirstName ?? "") +
                          " " +
                          (selectedChat.endUserLastName ?? "")}
                      </h6>
                    </h6>
                    <div className="d-flex gap-2 align-self-center align-items-center cursor-pointer justify-content-start">
                      <Avatar
                        style={{
                          background: getRandomColor(
                            selectedChat?.resourceFirstName || ""
                          ),
                          color: colors.black,
                        }}
                      >
                        {selectedChat?.resourceFirstName
                          ?.charAt(0)
                          .toUpperCase()}
                      </Avatar>
                      <div className="d-flex flex-column  align-items-start justify-content-start">
                        <div>
                          <ChaiiText className={styles.chat_text_fname}>
                            {selectedChat?.resourceFirstName ?? ""}
                          </ChaiiText>

                          <ChaiiText className={styles.chat_text}>
                            {selectedChat?.resourceLastName ?? ""}
                          </ChaiiText>
                        </div>
                        <ChaiiText className={styles.chat_text}>
                          {selectedChat?.resourceJobTitle ?? ""}
                        </ChaiiText>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      dispatch(toggleClearGetResourceById());
                      if (selectedChat)
                        navigate(
                          ROUTES.RESOURCE_PROFILE_REPLACE.replace(
                            ":id",
                            selectedChat?.resourceId
                          )
                        );
                    }}
                    label={t("button.viewProfile")}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            <Flex
              style={{ height: "92%" }}
              className="pb-2 p-2 pt-5 overflow-auto d-flex flex-column-reverse align-items-end"
              ref={scrollRef}
            >
              <Skeleton loading={initialLoading}>
                {messagesList?.length > 0 ? (
                  messagesList?.map(
                    (
                      {
                        content,
                        senderId,
                        sentAt,
                      }: {
                        content: string;
                        senderId: string;
                        sentAt: string;
                        readAt: string | null;
                      },
                      index
                    ) => (
                      <div
                        key={index}
                        className={` ${
                          isRecevier(senderId)
                            ? "justify-content-start "
                            : "justify-content-end"
                        }  d-flex gap-2  w-100 px-3 my-2 `}
                      >
                        {isRecevier(senderId) ? (
                          <Avatar
                            style={{
                              background: getRandomColor(
                                selectedChat?.resourceFirstName || ""
                              ),
                              color: colors.black,
                            }}
                          >
                            {selectedChat?.resourceFirstName
                              ?.charAt(0)
                              .toUpperCase()}
                          </Avatar>
                        ) : (
                          <></>
                        )}
                        <div
                          className={`${
                            isRecevier(senderId)
                              ? ` ${styles.message_div}`
                              : ` ${styles.message_sent_div} `
                          } rounded-2 d-flex flex-column`}
                        >
                          {isRecevier(senderId) && (
                            <span className={` ${styles.user_name}`}>
                              {selectedChat?.endUserFirstName}
                            </span>
                          )}
                          <div className={styles.message}>{content}</div>
                          <div className={styles.time}>
                            {returnTimeAndDate(sentAt)}{" "}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="h-100 w-100 justify-content-center align-items-center flex-column d-flex">
                    {!isSendingMessage && (
                      <>
                        <img
                          className={styles.notFoundImg}
                          src={require("../../assets/images/not-found.png")}
                        />
                        <div className={styles.notFoundText}>
                          {t("placeholder.notFoundInquiries")}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Skeleton>
            </Flex>
            <Row justify="space-between" className="w-100  py-2">
              <Col
                className="d-flex align-items-center h-100 justify-content-center"
                span={19}
              >
                <Form className="w-100" form={form}>
                  <ChaiInput
                    onClick={() => {
                      if (selectedChat) updateList(selectedChat?.id);
                    }}
                    onPressEnter={() => {
                      const val = form.getFieldValue("message");
                      if (val?.length > 0 && selectedChat)
                        sendMessage(val, selectedChat?.resourceId);
                    }}
                    name="message"
                    placeholder={t("placeholder.typeMessageHere")}
                  />
                </Form>
              </Col>
              <Col
                span={5}
                className="d-flex align-items-center h-100 justify-content-center"
              >
                <Spin spinning={isSendingMessage}>
                  <Button
                    onClick={() => {
                      const val = form.getFieldValue("message");
                      if (val?.length > 0 && selectedChat && !isSendingMessage)
                        sendMessage(val, selectedChat?.resourceId);
                    }}
                    label={t("button.send")}
                    btnClass="filledBtnWide"
                  />
                </Spin>
              </Col>
            </Row>
          </Content>
        </div>
      </div>
    </Content>
  );
};
